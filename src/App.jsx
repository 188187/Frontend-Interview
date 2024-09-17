import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import './App.css';


// 检测是否是触摸设备
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Item type
const ItemType = 'BOX';

// 单个箱子组件
function Box({ id, number, size, status, index, moveBox }) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { id, index }
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveBox(draggedItem.index, index);
        draggedItem.index = index; // Update index after moving
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className={`box ${size}`}>
      <p style={{ color: 'white'}}>番号: {number}</p>
      {/* <p>尺寸大小 {size}</p> */}
      <p className='box_status'>{status}</p>
    </div>
  );
}

// 主组件
function App() {
  const [boxesData, setBoxesData] = useState([
    { id: "001", number: "001", size: "M", status: "配備待ち" },
    { id: "002", number: "003", size: "M", status: "検証進捗 1/7" },
    { id: "003", number: "001", size: "M", status: "配備待ち" },
    { id: "004", number: "001", size: "M", status: "配備待ち" },
    { id: "005", number: "002", size: "L", status: "完了" },
    { id: "006", number: "002", size: "L", status: "配備待ち" },
    { id: "007", number: "002", size: "L", status: "完了" },
    { id: "008", number: "002", size: "L", status: "配備待ち" }
  ]);

  // 移动箱子
  const moveBox = (fromIndex, toIndex) => {
    const updatedBoxes = Array.from(boxesData);
    const [movedBox] = updatedBoxes.splice(fromIndex, 1);
    updatedBoxes.splice(toIndex, 0, movedBox);
    setBoxesData(updatedBoxes);
  };

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <h1 className="container_title">东内Locker</h1>
      <div className="box_container">
        {boxesData.map((box, index) => (
          <Box
            key={box.id}
            id={box.id}
            index={index}
            number={box.number}
            size={box.size}
            status={box.status}
            moveBox={moveBox}
          />
        ))}
      </div>
    </DndProvider>
  );
}

export default App;
