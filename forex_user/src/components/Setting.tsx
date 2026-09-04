import type React from "react";
import MotionWrapper from "../screens/Motion";
import PageHeadline from "./PageHeadline";
const Setting: React.FC = () => {
    return (
        <MotionWrapper>
            <PageHeadline
                title="Profile"
                subtitle="Welcome back! Here's an overview of your trading account."
                children={
                    <>

                    </>
                }
            />
        </MotionWrapper>
    )
};
export default Setting;