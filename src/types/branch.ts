export type RawBranch = {
    bank_code: string
    swift_code: string
    bank_name : string
    bank_name_hiragana : string
    bank_name_katakana : string
    bank_name_hepburn : string
    branch_code: string
    branch_name: string
    branch_name_hiragana : string
    branch_name_katakana : string
    branch_name_hepburn : string
    address: string
    postal_code: string
    sort_order: string
}

export type Branch = {
    bankCode: string
    swiftCode: string
    bankName : string
    bankNameHiragana : string
    bankNameKatakana : string
    bankNameHepburn : string
    branchCode: string
    branchName: string
    branchNameHiragana : string
    branchNameKatakana : string
    branchNameHepburn : string
    postalCode: string
    address: string
    sortOrder: string
}