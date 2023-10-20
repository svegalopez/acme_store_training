import React from "react";
import { useLocation } from "react-router-dom";
import Page from "../Page/Page";

export default function FooterPage() {
  const location = useLocation();
  return <Page title={location.pathname}></Page>;
}
