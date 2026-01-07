import { RawBranch, Branch } from "@/types/branch";
import { incrementApiCall } from "@/lib/apiCounter";

export async function fetchBranches(bankCode: string, query: string): Promise<Branch[]> {
    if (!query?.trim() || !bankCode?.trim()) return []

    // 文字数や文字種別によって、支店コードになりうるかをチェック
    const isBranchCodeQuery = /^[0-9０-９]{1,3}$/.test(query);

    // paramKey / paramValue を決める
    const paramValue = encodeURIComponent(query);

    const queryParams = isBranchCodeQuery
        ? `branch_code=${paramValue}`
        : `branch_name=${paramValue}`;

    try {
        incrementApiCall();
        const res = await fetch(
            `/api/banks/${bankCode}/branches?${queryParams}`, { cache: "no-store" }
        );

        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);

            alert(errorBody?.message ?? "Something went wrong.");

            return [];
        }

        const data: RawBranch[] | [] = await res.json();

        console.log(data)

        return data.map((b) => ({
            bankCode: b.bank_code,
            swiftCode: b.swift_code,
            bankName: b.bank_name,
            bankNameHiragana: b.bank_name_hiragana,
            bankNameKatakana: b.bank_name_katakana,
            bankNameHepburn: b.bank_name_hepburn,
            branchCode: b.branch_code,
            branchName: b.branch_name,
            branchNameHiragana: b.branch_name_hiragana,
            branchNameKatakana: b.branch_name_katakana,
            branchNameHepburn: b.branch_name_hepburn,
            postalCode: b.postal_code,
            address: b.address,
            sortOrder: b.sort_order,
        }))
    } catch (err) {
        console.error("支店データの取得に失敗しました", err)
        return [];
    }
}