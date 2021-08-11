import React from "react";
import { TokensTable } from "./tokens-table/tokens-table";
import { LoadingOverlay } from "../components/loader/loading-overlay";
import { useAppSelector } from "../store/hooks";
import { useTokensData } from "./useTokensData";

export const Tokens = () => {
  const { data, loading } = useAppSelector(
    ({ tokensDataSlice }) => tokensDataSlice
  );
  useTokensData();

  return !loading && data.length ? (
    <TokensTable data={data} />
  ) : (
    <LoadingOverlay />
  );
};
