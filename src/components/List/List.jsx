const List = ({ ItemComponent, items, setItems = null , setSelectedElement , setIsDelete }) => {
    console.log("items", items)
    return (
        <div className="space-y-4">
            {items.map((element) => (
                <ItemComponent key={element.url} setDeletingElement={setSelectedElement}  element={element} setElements={setItems} />
            ))}
        </div>
    )
}

export default List;