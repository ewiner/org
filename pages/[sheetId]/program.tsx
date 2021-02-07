import Header from "../../components/Header";
import {useRouter} from "next/router";

type Props = {
}

export default function ProgramView(props: Props) {
    const router = useRouter()
    const sheetId = parseInt(router.query.sheetId as string, 10)
    return (
        <>
            <Header currentUrl="program" sheetId={sheetId} />
            (todo)
        </>
    )
}
