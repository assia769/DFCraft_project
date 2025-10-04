const List = ({ ItemComponent, items, setItems = null }) => {
    return (
        <div className="space-y-4">
            {items.map((element) => (
                <ItemComponent key={element.url} element={element} setElements={setItems} />
            ))}
        </div>
    )
}

export default List;