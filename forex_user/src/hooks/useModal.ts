import { useCallback, useState } from "react";
export interface ModalState {
  order_execution?: boolean;
  market_watch?: boolean;
  is_profile?: boolean;
  crypto_details?: boolean;
  is_user?: boolean;
};
const useModal = <T = Record<string, any>>() => {
  const [isModalOpen, setIsOpen] = useState<ModalState>({});
  const [isImageModelOpen, setIsImageModelOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const openModal = useCallback(
    (
      type: ModalState,
      modalData?: T,
      isMerge: boolean = false
    ) => {
      setIsOpen((prev) => {
        const nextState = isMerge
          ? { ...prev, ...type }
          : type;

        return nextState;
      });

      if (modalData !== undefined) {
        setData((prev) => {
          if (prev === modalData) {
            return prev;
          }

          return modalData;
        });
      }
    },
    []
  );
  const closeModal = (type: ModalState = {}, isMerge: boolean = false) => {
    setIsOpen((prev) => (isMerge ? { ...prev, ...type } : type));
    setIsImageModelOpen(false);
    setData(null);
  };

  return {
    isModalOpen,
    openModal,
    closeModal,

    data,
    setData,

    isImageModelOpen,
    setIsImageModelOpen,
  };
};

export default useModal;
