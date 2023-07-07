const DiscussionTab = (props: { active: string; setActive: Function }) => {
  return (
    <button
      className={
        props.active === "Discussion"
          ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
          : "bg-gray-100 w-full hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green hover:border-b-1 hover:border-green"
      }
      onClick={() => props.setActive("Discussion")}
    >
      Discussion
    </button>
  );
};

export default DiscussionTab;
