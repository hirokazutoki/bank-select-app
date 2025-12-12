"use client"

import * as React from "react"
import { Header } from "@/components/Header";
import { BankComboboxPopover } from "@/components/BankComboboxPopover";
import { BranchComboboxPopover } from "@/components/BranchComboboxPopover";
import { Bank } from "@/types/bank";
import { Branch } from "@/types/branch";
import { Button } from "@/components/ui/button"
import { subscribeApiCallCount, getApiCallCount } from "@/lib/apiCounter";
import {useTranslation} from "react-i18next";

export default function Home() {
    const { t } = useTranslation();
    const [selectedBank, setSelectedBank] = React.useState<Bank | null>(null)
    const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null)
    const [apiCallCount, setApiCallCount] = React.useState(0);

    // 銀行変更時に支店をクリア
    React.useEffect(() => {
        setSelectedBranch(null)
    }, [selectedBank])

    React.useEffect(() => {
        const unsubscribe = subscribeApiCallCount(() => {
            setApiCallCount(getApiCallCount());
        });
        return () => unsubscribe();
    }, []);

    async function handleCheck() {
        if (selectedBank && selectedBranch) {
            const json = JSON.stringify(
                {
                    bank_name: selectedBank.bankName,
                    bank_code: selectedBank.bankCode,
                    swift_code: selectedBranch.swiftCode,
                    branch_code: selectedBranch.branchCode,
                    branch_name: selectedBranch.branchName,
                    post_code: selectedBranch.postCode,
                    address: selectedBranch.address,
                }, null, 2)
            alert(json)
        } else {
            alert(t("validationError"))
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
                    <div className="grid grid-cols-2 gap-3 w-full max-w-[400px]">
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "みずほ銀行",
                            bankCode: "0001",
                        })}>みずほ銀行</Button>
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "三井住友銀行",
                            bankCode: "0009",
                        })}>三井住友銀行</Button>
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "三菱UFJ銀行",
                            bankCode: "0005",
                        })}>三菱UFJ銀行</Button>
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "りそな銀行",
                            bankCode: "0010",
                        })}>りそな銀行</Button>
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "ゆうちょ銀行",
                            bankCode: "9900",
                        })}>ゆうちょ銀行</Button>
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "楽天銀行",
                            bankCode: "0036",
                        })}>楽天銀行</Button>
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "住信SBI銀行",
                            bankCode: "0038",
                        })}>住信SBI銀行</Button>
                        <Button variant="outline" onClick={() => setSelectedBank({
                            bankName: "PayPay銀行",
                            bankCode: "0033",
                        })}>PayPay銀行</Button>
                    </div>
                    <BranchComboboxPopover
                        selectedBranch={selectedBranch}
                        setSelectedBranch={setSelectedBranch}
                        selectedBank={selectedBank}
                    />
                    <div className="flex flex-col w-full max-w-[400px] gap-2 sm:flex-row">
                        <Button
                            variant="default"
                            className="w-full sm:flex-[0.8] justify-center font-bold"
                            onClick={handleCheck}
                        >
                            {t("check")}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full sm:flex-[0.2] justify-center"
                            onClick={handleReset}
                        >
                            {t("reset")}
                        </Button>
                    </div>

                    <div>API Call Count : {apiCallCount}</div>
                </main>
            </div>
        </>
    )
}
