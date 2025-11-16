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

export function BranchComboboxPopover({
  selectedBank,
  selectedBranch,
  setSelectedBranch,
}: {
    selectedBank: Bank | null;
    selectedBranch: Branch | null;
    setSelectedBranch: (branch: Branch | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [query, setQuery] = useState("");

    // 銀行が選ばれていない → 支店入力を無効化する
    const disabled = !selectedBank;

    useEffect(() => {
        if (!selectedBank) {
            setBranches([]);
            return;
        }

        fetchBranches(selectedBank.bankCode, query)
            .then(setBranches)
            .catch(console.error);
    }, [selectedBank, query]);

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">支店名</p>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className="w-[300px] justify-start"
                    >
                        {selectedBranch ? (
                            <>
                                {selectedBranch.branchName}
                                <span className="text-muted-foreground text-xs">
                                  （{selectedBranch.branchCode}）
                                </span>
                            </>
                        ) : (
                            <>未入力</>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[300px]" side="bottom" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="支店名・支店コードを入力"
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            <CommandEmpty>該当する支店がありません。</CommandEmpty>
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
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
