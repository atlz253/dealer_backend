class DBMoneyConverter {
    public static ConvertMoneyToNumber(money: any): number {
        if (money === null) {
            return 0;
        }

        return Number(money.toString().replace(" ?", "").replace(",", ".").replace(/\s/g, ""));
    }

    public static ConvertNumberToMoney(number: number): string {
        return number.toString().replace(".", ",");
    }
}

export default DBMoneyConverter;