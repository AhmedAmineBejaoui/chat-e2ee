import React, { useContext, useState } from "react";
import styles from "./styles/UserStatusInfo.module.css";
import ThemeToggle from "../ThemeToggle/index";
import imageRetryIcon from "./assets/image-retry.png";
import DeleteChatLink from "../DeleteChatLink";
import { IChatE2EE } from "@chat-e2ee/service";
import { ThemeContext } from "../../ThemeContext";

export const UserStatusInfo = ({
  online,
  getSetUsers,
  channelID,
  handleDeleteLink,
  chate2ee
}: {
  online: any;
  getSetUsers: any;
  channelID: any;
  handleDeleteLink: any;
  chate2ee: IChatE2EE;
}) => {
  const [loading, setLoading] = useState(false);
  const [darkMode] = useContext(ThemeContext);

  const fetchKeyAgain = async () => {
    if (loading) return;

    setLoading(true);
    await getSetUsers(channelID);
    setLoading(false);
  };

  return (
    <>
      <div className={styles.userInfo}>
        <div className={styles.contactBlock}>
          <div className={styles.avatarDot}></div>
          <div>
            <div className={styles.contactName}>Contact</div>
            {online ? (
              <div className={`${styles.contactStatus} ${styles.online}`}>online</div>
            ) : (
              <div
                className={`${styles.userOnlineWaiting} ${
                  !darkMode && styles.userOnlineWaitingLight
                }`}
              >
                Waiting to join...
                <img
                  className={
                    loading ? `${styles.retryImageIcon} ${styles.loading}` : `${styles.retryImageIcon}`
                  }
                  src={imageRetryIcon}
                  onClick={fetchKeyAgain}
                  alt="retry-icon"
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.headerActions}>
          <DeleteChatLink handleDeleteLink={handleDeleteLink} />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};
