import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { tokensDataLoaded } from "./reducer";

let subscription: EventSource | undefined;

export const useTokensData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!subscription) {
      subscription = new EventSource(
        `${process.env.REACT_APP_API_ROOT}/subscribe`
      );

      subscription.onmessage = (response) => {
        if (response.data) {
          const parsedData = JSON.parse(response.data);
          dispatch(tokensDataLoaded(parsedData));
        }
      };
    }
  }, [dispatch]);
};
