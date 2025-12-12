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
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        setIsFetching(true);
        fetchBanks(query)
            .then(setBanks)
            .catch(console.error)
            .finally(() => setIsFetching(false));
    }, [query]);

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">金融機関名</p>
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
                            <>未入力</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[400px]" side="bottom" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="銀行名・銀行コード・SWIFTコードのいずれかを入力"
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            {isFetching ? (
                                <CommandEmpty>
                                    検索中...
                                    <span className="ml-2 animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full border-current"></span>
                                </CommandEmpty>
                            ) : (
                                <>
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
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
