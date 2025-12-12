"use client"

import { useEffect, useState } from "react";
import { fetchBanks } from "@/lib/fetchers/fetchBanks";
import { Bank } from "@/types/bank";
import { Button } from "@/components/ui/button";
import {
    CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, Command
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {useTranslation} from "react-i18next";

export function BankComboboxPopover({
                                        selectedBank,
                                        setSelectedBank,
                                    }: {
    selectedBank: Bank | null;
    setSelectedBank: (bank: Bank | null) => void;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [isFetching, setIsFetching] = useState(false);

    const DEBOUNCE_MS = Number(process.env.NEXT_PUBLIC_DEBOUNCE_MS ?? 300);

    // debounce: query が変わったら DEBOUNCE_MS 待って debouncedQuery に反映
    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedQuery(query);
        }, DEBOUNCE_MS);

        return () => clearTimeout(id);
    }, [query, DEBOUNCE_MS]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setBanks([]);
            return;
        }

        setIsFetching(true);
        fetchBanks(debouncedQuery)
            .then(setBanks)
            .catch(console.error)
            .finally(() => setIsFetching(false));
    }, [debouncedQuery]);

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">{t("bankName")}</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[400px] justify-start">
                        {selectedBank ? (
                            <>
                                {selectedBank.bankName}
                                <span className="text-muted-foreground text-xs">
                                  （{selectedBank.bankCode}）
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
                            placeholder={t("bankPlaceholder")}
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
                                    <CommandEmpty>{t("bankNoResultsFound")}</CommandEmpty>
                                    <CommandGroup>
                                        {banks.map((bank) => (
                                            <CommandItem
                                                key={bank.bankCode}
                                                value={bank.bankName}
                                                onSelect={() => {
                                                    setSelectedBank(bank);
                                                    setOpen(false);
                                                }}
                                            >
                                                {bank.bankName}
                                                <span className="text-muted-foreground text-xs">
                                                  （{bank.bankCode}）
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
