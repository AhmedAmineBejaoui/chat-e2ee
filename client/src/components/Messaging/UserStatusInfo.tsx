import React, { useState } from "react";
import styles from "./styles/UserStatusInfo.module.css";
import ThemeToggle from "../ThemeToggle/index";
import imageRetryIcon from "./assets/image-retry.png";
import DeleteChatLink from "../DeleteChatLink";
import { IChatE2EE } from "@chat-e2ee/service";

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

  const fetchKeyAgain = async () => {
    if (loading) return;

    setLoading(true);
    await getSetUsers(channelID);
    setLoading(false);
  };

  return (
    <>
      <div className={styles.userInfo}>
        {online ? (
          <span className={styles.userInfoOnline}>
            {"<"}Online{">"}
          </span>
        ) : (
          <div className={styles.userOnlineWaiting}>
            Waiting for Alice to join...
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
        <DeleteChatLink handleDeleteLink={handleDeleteLink} />
        <ThemeToggle />
      </div>
    </>
  );
};
