

const List = ({ ItemComponent, items, setItems = null }) => {

    return (
        <div>
            {items.map((element) => (
                <ItemComponent key={element.url} element={element} setElements={setItems} />
            ))}

        </div>
    )
}

export default List 