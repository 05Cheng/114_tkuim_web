export default function ProductForm({ value, onChange }) {
    const v = value;
  
    function set(k, val) {
      onChange({ ...v, [k]: val });
    }
  
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="label">商品名稱</div>
          <input className="input" value={v.name} onChange={(e) => set("name", e.target.value)} />
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="label">價格</div>
            <input className="input" type="number" value={v.price} onChange={(e) => set("price", e.target.value)} />
          </div>
  
          <div className="space-y-1">
            <div className="label">庫存</div>
            <input className="input" type="number" value={v.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
        </div>
  
        <div className="space-y-1">
          <div className="label">描述</div>
          <textarea className="input min-h-28" value={v.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </div>
    );
  }
  