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
type RawBank = {
    bank_name: string
    bank_code: string
}
type RawBranch = {
    branch_name: string
    branch_code: string
}
type Bank = {
    bankName: string
    bankCode: string
}
type Branch = {
    branchName: string
    branchCode: string
}
const branches: Branch[] = [
    {
        branchName: "インターネット",
        branchCode: "101",
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
    const [banks, setBanks] = React.useState<Bank[]>([]);
    const [query, setQuery] = React.useState("");

    // 入力のたびに API 叩く（実運用では debounce 推奨）
    React.useEffect(() => {
        const fetchBanks = async () => {
            if (!query) {
                setBanks([]);
                return;
            }

            try {
                // 文字数や文字種別によって、銀行コード・SWIFTコードになりうるかをチェック
                const isCodeQuery = /^[0-9０-９]{1,4}$/.test(query);
                const isEightChar = /^[A-Za-z0-9Ａ-Ｚａ-ｚ０-９]{8}$/.test(query);

                // paramKey / paramValue を決める
                const paramValue = encodeURIComponent(query);
                let queryParams;

                if (isCodeQuery) {
                    queryParams = `bank_code=${paramValue}`;
                } else if (isEightChar) {
                    queryParams = `swift_code=${paramValue}&bank_name=${paramValue}`;
                } else {
                    queryParams = `bank_name=${paramValue}`;
                }

                // TODO: 本来は、use serverで行うべき
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BANK_API_URL}?${queryParams}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-KEY": `${process.env.NEXT_PUBLIC_BANK_API_KEY}`
                        },
                    }
                );
                const data : RawBank[]|[] = await res.json();

                // snake_case → camelCase に変換
                const banks : Bank[] = data.map((b) => ({
                    bankName: b.bank_name,
                    bankCode: b.bank_code,
                }));

                setBanks(banks);
            } catch (err) {
                console.error("銀行データの取得に失敗しました", err);
            }
        };

        fetchBanks();
    }, [query]);

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-muted-foreground text-sm">金融機関名</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[300px] justify-start">
                        {selectedBank ? <>{selectedBank.bankName} <span className="text-muted-foreground text-xs">（{selectedBank.bankCode}）</span></> : <>未入力</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                        <CommandInput
                            placeholder="金融機関名を入力してください"
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            <CommandEmpty>該当する金融機関がありません。</CommandEmpty>
                            <CommandGroup>
                                {banks.map((status) => (
                                    <CommandItem
                                        key={status.bankCode}
                                        value={status.bankName}
                                        onSelect={(value) => {
                                            setSelectedBank(
                                                banks.find((s) => s.bankName === value) || null
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        {status.bankName} <span className="text-muted-foreground text-xs">（ {status.bankCode} ）</span>
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
                queryParams = `bank_name=${paramValue}`;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BANK_API_URL}/${selectedBank.bankCode}/branches?${queryParams}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-KEY": `${process.env.NEXT_PUBLIC_BANK_API_KEY}`
                        },
                    }
                );

                const data: RawBranch[] | [] = await res.json()

                const branches: Branch[] = data.map((b) => ({
                    branchName: b.branch_name,
                    branchCode: b.branch_code,
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
                    <Command>
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

    // 銀行変更時に支店をクリア
    React.useEffect(() => {
        setSelectedBranch(null)
    }, [selectedBank])

    async function handleCheck() {
        if (selectedBank) {
            const json = JSON.stringify(
                {
                    bank_name: selectedBank.bankName,
                    bank_code: selectedBank.bankCode,
                    branch_code: selectedBranch?.branchCode,
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
