"use client"

import * as React from "react"
import { Header } from "@/components/Header";
import { BankComboboxPopover } from "@/components/BankComboboxPopover";
import { BranchComboboxPopover } from "@/components/BranchComboboxPopover";
import { Bank } from "@/types/bank";
import { Branch } from "@/types/branch";

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

    async function handleReset() {
        setSelectedBank(null)
        setSelectedBranch(null)
    }

    return (
        <>
            <Header />
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
                        className="btn btn-blue border px-4 py-2 rounded w-full mt-4"
                        onClick={handleCheck}
                    >
                        確認
                    </button>

                    <button
                        className="btn btn-white text-gray-600 border px-4 py-1 rounded w-full mt-0"
                        onClick={handleReset}
                    >
                        リセット
                    </button>
                </main>
            </div>
        </>
    )
}
