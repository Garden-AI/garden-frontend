const DiscussionTab = (props: { active: string; setActive: Function }) => {
  return (
    <button
      className={
        props.active === "Discussion"
          ? "w-full border-b-4 border-green bg-green bg-opacity-30"
          : "hover:border-b-1 w-full bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"
      }
      onClick={() => props.setActive("Discussion")}
    >
      Discussion
    </button>
  );
};

export default DiscussionTab;
