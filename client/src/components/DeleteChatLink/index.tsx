import React from "react";
const DeleteChatLink = ({ handleDeleteLink }: any) => {
  const deleteHandler = async () => {
    if (window.confirm("Delete chat link forever?")) await handleDeleteLink();
  };
  return (
    <button
      onClick={deleteHandler}
      type="button"
      className="rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/20 hover:border-white/60 lg:text-xs"
    >
      Delete
    </button>
  )
}

export default DeleteChatLink;
