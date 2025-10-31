import React, { useContext } from "react";
import styles from "./Style.module.css";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { ThemeContext } from "../../../ThemeContext";

type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

const RemoveButton = ({ onClick }: ButtonProps) => {
  const [darkMode] = useContext(ThemeContext);
  return (
    <div
      className={`${styles.removeButtonContainer} 
    ${darkMode === true ? styles.darkMode : styles.lightMode}`}
      onClick={onClick}
      role="button"
      aria-label="Remove selected image"
    >
      <IoMdCloseCircleOutline className={styles.checkmark} />
    </div>
  );
};

export default RemoveButton;
