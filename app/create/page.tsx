import React from "react";
import Layout from "@/components/Layout";
import Content from "@/module/create/Content";
import Protected from "../Protected";
const Create = () => {
  return (
    <Protected>
      <Layout>
        <Content />
      </Layout>
    </Protected>
  );
};

export default Create;
