"use client"

import * as React from "react"
import { BankComboboxPopover } from "@/components/BankComboboxPopover";
import { Bank } from "@/types/bank";
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
type RawBranch = {
    branch_name: string
    branch_code: string
    address: string
    post_code: string
    sort_order: string
}
type Branch = {
    branchName: string
    branchCode: string
    postCode: string
    address: string
    sortOrder: string
}

function BranchComboboxPopover({
   selectedBranch,
   setSelectedBranch,
   selectedBank,
}: {
    selectedBranch: Branch | null
    setSelectedBranch: React.Dispatch<React.SetStateAction<Branch | null>>
    selectedBank: Bank | null
}) {
    const [open, setOpen] = React.useState(false)
    const [branches, setBranches] = React.useState<Branch[]>([])
    const [query, setQuery] = React.useState("")

    React.useEffect(() => {
        const fetchBranches = async () => {
            if (!query || !selectedBank) {
                setBranches([])
                return
            }

            // 文字数や文字種別によって、支店コードになりうるかをチェック
            const isBranchCodeQuery = /^[0-9０-９]{1,3}$/.test(query);

            // paramKey / paramValue を決める
            const paramValue = encodeURIComponent(query);
            let queryParams;

            if (isBranchCodeQuery) {
                queryParams = `branch_code=${paramValue}`;
            } else {
                queryParams = `branch_name=${paramValue}`;
            }

            try {
                const res = await fetch(
                    `/api/banks/${selectedBank.bankCode}/branches?${queryParams}`
                );

                const data: RawBranch[] | [] = await res.json();

                const branches: Branch[] = data.map((b) => ({
                    branchName: b.branch_name,
                    branchCode: b.branch_code,
                    postCode: b.post_code,
                    address: b.address,
                    sortOrder: b.sort_order,
                }))

                setBranches(branches)
            } catch (err) {
                console.error("支店データの取得に失敗しました", err)
            }
        }

        fetchBranches()
    }, [query, selectedBank])


    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">支店名</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[300px] justify-start">
                        {selectedBranch ? <>{selectedBranch.branchName} <span className="text-muted-foreground text-xs">（{selectedBranch.branchCode}）</span></> : <>未入力</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]" side="bottom" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="支店名・支店コードを入力してください"
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            <CommandEmpty>該当する支店がありません。</CommandEmpty>
                            <CommandGroup>
                                {branches.map((branch) => (
                                    <CommandItem
                                        key={branch.branchCode + "-" + branch.sortOrder}
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

    // 銀行変更時に支店をクリア
    React.useEffect(() => {
        setSelectedBranch(null)
    }, [selectedBank])

    async function handleCheck() {
        if (selectedBank && selectedBranch) {
            const json = JSON.stringify(
                {
                    bank_name: selectedBank.bankName,
                    bank_code: selectedBank.bankCode,
                    swift_code: selectedBank.swiftCode,
                    branch_code: selectedBranch.branchCode,
                    branch_name: selectedBranch.branchName,
                    post_code: selectedBranch.postCode,
                    address: selectedBranch.address,
                }, null, 2)
            alert(json)
        } else {
            alert("銀行と支店が選択されていません")
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
                    selectedBank={selectedBank}
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
