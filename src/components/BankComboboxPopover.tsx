"use client"

import { useEffect, useState } from "react";
import { fetchBanks } from "@/lib/fetchers/fetchBanks";
import { Bank } from "@/types/bank";
import { Button } from "@/components/ui/button";
import {
    CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, Command
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function BankComboboxPopover({
    selectedBank,
    setSelectedBank,
}: {
    selectedBank: Bank | null;
    setSelectedBank: (bank: Bank | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchBanks(query).then(setBanks).catch(console.error);
    }, [query]);

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">金融機関名</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[300px] justify-start">
                        {selectedBank ? (
                            <>
                                {selectedBank.bankName}
                                <span className="text-muted-foreground text-xs">
                                  （{selectedBank.bankCode}）
                                </span>
                            </>
                        ) : (
                            <>未入力</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput value={query} onValueChange={setQuery} />
                        <CommandList>
                            <CommandEmpty>該当する金融機関がありません。</CommandEmpty>
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
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
