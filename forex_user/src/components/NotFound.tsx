import React from "react";
import { motion } from "framer-motion";

interface NoDataFoundProps {
  message?: string;
  className?: string;
}
const theme = {
  wrapper: `
    text-gray-500

    dark:text-gray-400
  `,

  message: `
    text-gray-700
    dark:text-gray-300
  `,
};

const NoDataFound: React.FC<
  NoDataFoundProps
> = ({
  message = "No data found.",
  className = "",
}) => {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className={`
        h-[63vh]
        w-full
        flex
        items-center
        justify-center
        ${theme.wrapper}
        ${className}
      `}
      >
        <p
          className={`
          text-lg
          font-medium
          ${theme.message}
        `}
        >
          {message}
        </p>
      </motion.div>
    );
  };

export default NoDataFound;