import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { compareArrays } from "../../../utils/arrays_utils";

export default function CartHeader({ checkoutItems, selected, setSelected }) {
  const [active, setActive] = useState();
  
  useEffect(() => {
    const check = compareArrays(checkoutItems, selected);
    setActive(check);
  }, [selected]);
  
  const handleSelect = () => {
    if (selected.length !== checkoutItems.length) {
      setSelected(checkoutItems);
    } else {
      setSelected([]);
    }
  };

  return (
    <div className={`${styles.cart__header} ${styles.card}`}>
      <h1>Item Summary({checkoutItems.length})</h1>
      <div className={styles.flex} onClick={() => handleSelect()}>
        <div
          className={`${styles.checkbox} ${active ? styles.active : ""}`}
        ></div>
        <span>Select all items</span>
      </div>
    </div>
  );
}
