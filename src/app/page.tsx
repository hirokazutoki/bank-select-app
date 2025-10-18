"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
type Bank = {
    bankName: string
    label: string
    code: string
}
const statuses: Bank[] = [
    {
        bankName: "backlog",
        label: "みずほ",
        code: "0001",
    },
    {
        bankName: "todo",
        label: "三菱ＵＦＪ",
        code: "0005",
    },
    {
        bankName: "in progress",
        label: "三井住友",
        code: "0009",
    },
    {
        bankName: "done",
        label: "りそな",
        code: "0010",
    },
    {
        bankName: "canceled",
        label: "埼玉りそな",
        code: "0017",
    },
]


function ComboboxPopover() {
    const [open, setOpen] = React.useState(false)
    const [selectedBank, setSelectedBank] = React.useState<Bank | null>(
        null
    )
    return (
        <div className="flex items-center space-x-4">
            <p className="text-muted-foreground text-sm">金融機関名</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[300px] justify-start">
                        {selectedBank ? <>{selectedBank.label}</> : <>未入力</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                        <CommandInput placeholder="銀行名を入力してください" />
                        <CommandList>
                            <CommandEmpty>該当する金融機関がありません。</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.code}
                                        value={status.code}
                                        onSelect={(value) => {
                                            setSelectedBank(
                                                statuses.find((priority) => priority.code === value) ||
                                                null
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        {status.label} （ {status.code} ）
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}


export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ComboboxPopover/>
      </main>
    </div>
  );
}
