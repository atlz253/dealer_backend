import express, { Request, Response } from "express";
import IBaseContract from "audio_diler_common/interfaces/IBaseContract";
import IContract from "audio_diler_common/interfaces/IContract";
import dilerAuthCheck from "./dilerAuthCheck";
import jwtCheck from "./jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";

const contractsRouter = express.Router();

contractsRouter.use(jwtCheck);
contractsRouter.use(dilerAuthCheck);

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

    const response: IResponse<IBaseContract[]> = {
        status: 200,
        data: mockup
    }

    res.json(response);
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
            billNumber: "12345678901234567890",
            bankName: "ОАО «Альфа-банк»",
            correspondentBill: "12345",
            BIC: "1111",
            INN: "2222"
        },
        buyerBill: {
            ownerName: "Мигас Александр Сергеевич",
            billNumber: "12345678901234567890",
            bankName: "ОАО «Альфа-банк»",
            correspondentBill: "0",
            BIC: "0",
            INN: "0"
        },
        products: [
            {
                id: 0,
                name: "Lorem ipsum",
                category: "aboba",
                quantity: 10,
                price: 999
            }
        ]
    };

    const response: IResponse<IContract> = {
        status: 200,
        data: mockup
    }

    res.json(response);
});

export default contractsRouter;