import { RawBranch, Branch } from "@/types/branch";

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
        const res = await fetch(
            `/api/banks/${bankCode}/branches?${queryParams}`, { cache: "no-store" }
        );

        const data: RawBranch[] | [] = await res.json();

        return data.map((b) => ({
            branchName: b.branch_name,
            branchCode: b.branch_code,
            postCode: b.post_code,
            address: b.address,
            sortOrder: b.sort_order,
        }))
    } catch (err) {
        console.error("支店データの取得に失敗しました", err)
        return [];
    }
}