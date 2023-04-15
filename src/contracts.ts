import express, { Request, Response } from "express";
import IBaseContract from "audio_diler_common/interfaces/IBaseContract";
import IContract from "audio_diler_common/interfaces/IContract";

const contractsRouter = express.Router();

contractsRouter.get('/', (req: Request, res: Response) => {
    const mockup: IBaseContract[] = [
        {
            id: 0,
            seller: "Столяров Д.Д.",
            buyer: "Мигас А.С.",
            price: 999,
            date: Date.now()
        },
        {
            id: 1,
            seller: "Столяров Д.Д.",
            buyer: "Мигас А.С.",
            price: 999,
            date: Date.now()
        },
        {
            id: 2,
            seller: "Столяров Д.Д.",
            buyer: "Мигас А.С.",
            price: 9999,
            date: Date.now()
        },
        {
            id: 3,
            seller: "Столяров Д.Д.",
            buyer: "Мигас А.С.",
            price: 999,
            date: Date.now()
        },
    ];

    res.send(mockup);
});

contractsRouter.get('/:contractID', (req: Request, res: Response) => {
    const mockup: IContract =
    {
        id: Number(req.params.contractID),
        seller: "Столяров Д.Д.",
        buyer: "Мигас А.С.",
        price: 999,
        date: Date.now(),
        sellerBill: {
            ownerName: "Дмитрий Дмитриевич Столяров",
            billNumber: 12345678901234567890,
            bankName: "ОАО «Альфа-банк»",
            correspondentBill: 12345,
            BIC: 1111,
            INN: 2222
        },
        buyerBill: {
            ownerName: "Мигас Александр Сергеевич",
            billNumber: 12345678901234567890,
            bankName: "ОАО «Альфа-банк»",
            correspondentBill: 0,
            BIC: 0,
            INN: 0
        },
        products: [
            {
                id: 0,
                name: "Lorem ipsum",
                quantity: 10,
                price: 999
            }
        ]
    };

    res.send(mockup);
});

export default contractsRouter;