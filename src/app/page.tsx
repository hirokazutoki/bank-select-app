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
const banks: Bank[] = [
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

type Branch = {
    branchName: string
    branchNameKana: string
    branchCode: string
    subBranchCode: string
}
const branches: Branch[] = [
    {
        branchName: "インターネット",
        branchNameKana: "インタ-ネツト",
        branchCode: "101",
        subBranchCode: "1",
    },
]


function BankComboboxPopover({
     selectedBank,
     setSelectedBank,
 }: {
    selectedBank: Bank | null
    setSelectedBank: React.Dispatch<React.SetStateAction<Bank | null>>
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">金融機関名</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[300px] justify-start">
                        {selectedBank ? <>{selectedBank.label} <span className="text-muted-foreground text-xs">（{selectedBank.code}）</span></> : <>未入力</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                        <CommandInput placeholder="銀行名を入力してください" />
                        <CommandList>
                            <CommandEmpty>該当する金融機関がありません。</CommandEmpty>
                            <CommandGroup>
                                {banks.map((status) => (
                                    <CommandItem
                                        key={status.code}
                                        value={status.code}
                                        onSelect={(value) => {
                                            setSelectedBank(
                                                banks.find((s) => s.code === value) || null
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        {status.label} <span className="text-muted-foreground text-xs">（ {status.code} ）</span>
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
function BranchComboboxPopover({
  selectedBranch,
  setSelectedBranch,
}: {
  selectedBranch: Branch | null
  setSelectedBranch: React.Dispatch<React.SetStateAction<Branch | null>>
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">支店名</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[300px] justify-start">
                        {selectedBranch ? <>{selectedBranch.branchName} <span className="text-muted-foreground text-xs">（{selectedBranch.branchCode}）</span></> : <>未入力</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[400px]" side="bottom" align="start">
                    <Command>
                        <CommandInput placeholder="支店名を入力してください（ひらがな・カタカナ）" />
                        <CommandList>
                            <CommandEmpty>該当する支店がありません。</CommandEmpty>
                            <CommandGroup>
                                {branches.map((branch) => (
                                    <CommandItem
                                        key={branch.branchCode}
                                        value={branch.branchCode}
                                        onSelect={(value) => {
                                            setSelectedBranch(
                                                branches.find((s) => s.branchCode === value) || null
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        {branch.branchName} <span className="text-muted-foreground text-xs">（ {branch.branchCode} ）</span>
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
    const [selectedBank, setSelectedBank] = React.useState<Bank | null>(null)
    const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null)

    async function handleCheck() {
        if (selectedBank) {
            const json = JSON.stringify(
                {
                    bank_nme: selectedBank.label,
                    bank_code: selectedBank.code,
                    branch_code: selectedBranch?.branchCode,
                    sub_branch_code: selectedBranch?.subBranchCode,
                    branch_name: selectedBranch?.branchName,
                }, null, 2)
            alert(json)
        } else {
            alert("銀行が選択されていません")
        }
    }

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <BankComboboxPopover
                    selectedBank={selectedBank}
                    setSelectedBank={setSelectedBank}
                />
                <BranchComboboxPopover
                    selectedBranch={selectedBranch}
                    setSelectedBranch={setSelectedBranch}
                />
                <button
                    className="btn btn-blue border px-4 py-2 rounded w-full"
                    onClick={handleCheck}
                >
                    確認
                </button>
            </main>
        </div>
    )
}
