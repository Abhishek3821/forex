import type React from "react";
import MotionWrapper from "../screens/Motion";
import PageHeadline from "./PageHeadline";
const PortFolio: React.FC = () => {
    return (
        <MotionWrapper>
            <PageHeadline
                title="Portfolio"
                subtitle="Welcome back! Here's an overview of your trading account."
                children={
                    <>

                    </>
                }
            />
        </MotionWrapper>
    )
};
export default PortFolio;