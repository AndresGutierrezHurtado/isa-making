import { useEffect } from "react";

export default function useSetTitle(title) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
