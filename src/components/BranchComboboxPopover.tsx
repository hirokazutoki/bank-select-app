"use client";

import { useEffect, useState } from "react";
import { fetchBranches } from "@/lib/fetchers/fetchBranches";
import { Bank } from "@/types/bank";
import { Branch } from "@/types/branch";
import { Button } from "@/components/ui/button";
import {
    CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, Command
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {useTranslation} from "react-i18next";

export function BranchComboboxPopover({
                                          selectedBank,
                                          selectedBranch,
                                          setSelectedBranch,
                                      }: {
    selectedBank: Bank | null;
    selectedBranch: Branch | null;
    setSelectedBranch: (branch: Branch | null) => void;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [isFetching, setIsFetching] = useState(false);

    const DEBOUNCE_MS = Number(process.env.NEXT_PUBLIC_DEBOUNCE_MS ?? 300);

    // 銀行が選ばれていない → 支店入力を無効化する
    const disabled = !selectedBank;

    // 銀行変更時に、支店の検索文字列を削除する
    useEffect(() => {
        setQuery("");
        setDebouncedQuery("");
        setBranches([]);
        setSelectedBranch(null);
    }, [selectedBank, setSelectedBranch]);

    // debounce: query が変わったら DEBOUNCE_MS 待って debouncedQuery に反映
    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedQuery(query);
        }, DEBOUNCE_MS);

        return () => clearTimeout(id);
    }, [query, DEBOUNCE_MS]);

    useEffect(() => {
        if (!selectedBank || !debouncedQuery.trim()) {
            setBranches([]);
            setIsFetching(false);
            return;
        }

        setIsFetching(true);
        fetchBranches(selectedBank.bankCode, debouncedQuery)
            .then(setBranches)
            .catch(console.error)
            .finally(() => setIsFetching(false));
    }, [selectedBank, debouncedQuery]);

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">{t("branchName")}</p>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className="w-[400px] justify-start"
                    >
                        {selectedBranch ? (
                            <>
                                {selectedBranch.branchName}
                                <span className="text-muted-foreground text-xs">
                                  （{selectedBranch.branchCode}）
                                </span>
                            </>
                        ) : (
                            <>{t("notSet")}</>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[400px]" side="bottom" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={t("branchPlaceholder")}
                            value={query}
                            onValueChange={(v) =>　{
                                setQuery(v);
                                setIsFetching(true);
                            }}
                        />
                        <CommandList>
                            {isFetching ? (
                                <CommandEmpty>
                                    {t("searching")}
                                    <span className="ml-2 animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full border-current"></span>
                                </CommandEmpty>
                            ) : (
                                <>
                                    <CommandEmpty>{t("branchNoResultsFound")}</CommandEmpty>
                                    <CommandGroup>
                                        {branches.map((branch) => (
                                            <CommandItem
                                                key={`${branch.branchCode}-${branch.sortOrder}`}
                                                value={`${branch.branchCode} ${branch.branchName}`}
                                                onSelect={() => {
                                                    setSelectedBranch(branch);
                                                    setOpen(false);
                                                }}
                                            >
                                                {branch.branchName}
                                                <span className="text-muted-foreground text-xs">
                                                  （{branch.branchCode}）
                                                </span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
