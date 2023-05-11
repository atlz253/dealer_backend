import { describe, expect, test } from "@jest/globals";
import DBMoneyConverter from "../src/utils/DBMoneyConverter";

describe.each([
    { money: "100 ?", number: 100 },
    { money: "100 000 ?", number: 100000 },
    { money: "100,123 ?", number: 100.123 },
])
    ("Конвертирование при помощи DBMoneyConverter ($input, $expected)", ({ money, number }) => {
        test("Перевод денежного типа в число", () => {
            const result = DBMoneyConverter.ConvertMoneyToNumber(money);

            expect(result).toBeCloseTo(number);
        });

        test("Перевод числа в денежный тип", () => {
            const result = DBMoneyConverter.ConvertNumberToMoney(number);

            expect(result).toBe(money);
        });
    });