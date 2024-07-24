interface RenderTagsProps {
    items: string[];
    title: string;
}

const RenderTags: React.FC<RenderTagsProps> = ({ items, title }) => (
    <div className="space-y-2">
        <p className="text-gray-600 flex items-center">{title}</p>
        <div className="flex flex-wrap gap-2">
            {items.length > 0 ? (
                items.map((item, index) => (
                    <span key={index} className="rounded-lg bg-primary p-1 px-2 text-xs text-primary-foreground">
                        {item}
                    </span>
                ))
            ) : (
                <p className="text-sm text-gray-500 italic">No {title.toLowerCase()} listed yet.</p>
            )}
        </div>
    </div>
);

export default RenderTags;