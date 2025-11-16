import { RawBank, Bank } from "@/types/bank";

export async function fetchBanks(query: string): Promise<Bank[]> {
    if (!query) return [];

    const isCodeQuery = /^[0-9０-９]{1,4}$/.test(query);
    const isEightChar = /^[A-Za-z0-9Ａ-Ｚａ-ｚ０-９]{8}$/.test(query);

    const paramValue = encodeURIComponent(query);
    let queryParams;

    if (isCodeQuery) queryParams = `bank_code=${paramValue}`;
    else if (isEightChar) queryParams = `swift_code=${paramValue}&bank_name=${paramValue}`;
    else queryParams = `bank_name=${paramValue}`;

    const res = await fetch(`/api/banks?${queryParams}`);
    const data: RawBank[] = await res.json();

    return data.map((b) => ({
        swiftCode: b.swift_code,
        bankName: b.bank_name,
        bankCode: b.bank_code,
    }));
}
