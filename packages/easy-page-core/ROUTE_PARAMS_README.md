# 路由参数管理功能

Easy Page Core 提供了完整的路由参数管理功能，支持自动解析URL参数、状态管理、变化监听等特性。

## 功能特性

- ✅ 自动解析URL查询参数
- ✅ 状态管理，支持响应式更新
- ✅ 详细的变化事件监听
- ✅ 浏览器URL同步更新
- ✅ 支持单个和批量操作
- ✅ 提供便捷的Hook接口

## 基本使用

### 1. 在Form组件中初始化

```tsx
import { Form } from 'easy-page-core';

function MyForm() {
  return (
    <Form 
      initialRouteParams={{ page: '1', size: '10' }}
      // 其他表单配置...
    >
      {/* 表单内容 */}
    </Form>
  );
}
```

### 2. 使用useRouteParams Hook

```tsx
import { useRouteParams, RouteParamsAction } from 'easy-page-core';

function MyComponent() {
  const {
    routeParams,           // 当前路由参数状态
    lastChangeEvent,       // 最后一次变化事件
    getRouteParam,         // 获取单个参数
    setRouteParam,         // 设置单个参数
    setRouteParams,        // 批量设置参数
    removeRouteParam,      // 移除单个参数
    updateRouteParams,     // 更新参数（合并）
    clearRouteParams,      // 清空所有参数
    updateBrowserUrl,      // 更新浏览器URL
    resetRouteParams,      // 重置到初始状态
  } = useRouteParams();

  // 获取参数
  const page = getRouteParam('page');
  
  // 设置参数
  const handlePageChange = (newPage: string) => {
    setRouteParam('page', newPage);
    updateBrowserUrl(); // 可选：同步更新浏览器URL
  };

  return (
    <div>
      <p>当前页码: {page}</p>
      <button onClick={() => handlePageChange('2')}>跳转到第2页</button>
    </div>
  );
}
```

## 路由参数变化事件

每次路由参数变化都会触发详细的事件，包含以下信息：

```tsx
interface RouteParamsChangeEvent {
  action: RouteParamsAction;                    // 动作类型
  key?: string;                                // 操作的参数键
  value?: string;                              // 设置的值
  params?: Record<string, string>;             // 批量操作的参数
  previousParams: Record<string, string>;      // 变化前的参数
  currentParams: Record<string, string>;       // 变化后的参数
}
```

### 动作类型枚举

```tsx
enum RouteParamsAction {
  SET = 'set',           // 设置单个参数
  BATCH_SET = 'batchSet', // 批量设置参数
  REMOVE = 'remove',     // 移除单个参数
  UPDATE = 'update',     // 更新参数（合并）
  CLEAR = 'clear',       // 清空所有参数
  RESET = 'reset',       // 重置到初始状态
  PARSE = 'parse',       // 从URL解析
}
```

### 监听变化事件

```tsx
function EventMonitor() {
  const { lastChangeEvent } = useRouteParams();

  useEffect(() => {
    if (lastChangeEvent) {
      console.log('路由参数变化:', {
        动作: lastChangeEvent.action,
        操作键: lastChangeEvent.key,
        设置值: lastChangeEvent.value,
        变化前: lastChangeEvent.previousParams,
        变化后: lastChangeEvent.currentParams,
      });
    }
  }, [lastChangeEvent]);

  return (
    <div>
      {lastChangeEvent && (
        <p>最近变化: {lastChangeEvent.action} - {lastChangeEvent.key}</p>
      )}
    </div>
  );
}
```

## API 参考

### useRouteParams Hook

#### 状态
- `routeParams: Record<string, string>` - 当前路由参数状态
- `lastChangeEvent: RouteParamsChangeEvent | null` - 最后一次变化事件

#### 方法
- `getRouteParams(): Record<string, string>` - 获取所有路由参数
- `getRouteParam(key: string): string | undefined` - 获取单个路由参数
- `setRouteParam(key: string, value: string): void` - 设置单个路由参数
- `setRouteParams(params: Record<string, string>): void` - 批量设置路由参数
- `removeRouteParam(key: string): void` - 移除单个路由参数
- `updateRouteParams(params: Record<string, string>): void` - 更新路由参数（合并）
- `clearRouteParams(): void` - 清空所有路由参数
- `updateBrowserUrl(replace?: boolean): void` - 更新浏览器URL
- `buildQueryString(): string` - 构建查询字符串
- `resetRouteParams(): void` - 重置到初始状态

### Form 组件 Props

- `initialRouteParams?: Record<string, string>` - 初始路由参数

## 使用场景

### 1. 分页组件

```tsx
function Pagination() {
  const { getRouteParam, setRouteParam, updateBrowserUrl } = useRouteParams();
  
  const currentPage = getRouteParam('page') || '1';
  const pageSize = getRouteParam('size') || '10';

  const handlePageChange = (page: number) => {
    setRouteParam('page', page.toString());
    updateBrowserUrl();
  };

  return (
    <div>
      <button onClick={() => handlePageChange(parseInt(currentPage) - 1)}>
        上一页
      </button>
      <span>第 {currentPage} 页</span>
      <button onClick={() => handlePageChange(parseInt(currentPage) + 1)}>
        下一页
      </button>
    </div>
  );
}
```

### 2. 搜索组件

```tsx
function SearchBox() {
  const { getRouteParam, setRouteParam, updateBrowserUrl } = useRouteParams();
  
  const searchKeyword = getRouteParam('search') || '';

  const handleSearch = (keyword: string) => {
    if (keyword) {
      setRouteParam('search', keyword);
    } else {
      removeRouteParam('search');
    }
    setRouteParam('page', '1'); // 重置到第一页
    updateBrowserUrl();
  };

  return (
    <input
      value={searchKeyword}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

### 3. 筛选组件

```tsx
function FilterComponent() {
  const { updateRouteParams, updateBrowserUrl } = useRouteParams();

  const handleFilterChange = (filters: Record<string, string>) => {
    updateRouteParams(filters);
    setRouteParam('page', '1'); // 重置到第一页
    updateBrowserUrl();
  };

  return (
    <div>
      <select onChange={(e) => handleFilterChange({ category: e.target.value })}>
        <option value="">全部分类</option>
        <option value="tech">技术</option>
        <option value="design">设计</option>
      </select>
    </div>
  );
}
```

## 注意事项

1. **自动解析**: Form组件初始化时会自动解析当前URL的查询参数
2. **状态同步**: 路由参数变化会自动触发相关组件的重新渲染
3. **URL更新**: 需要手动调用`updateBrowserUrl()`来同步更新浏览器URL
4. **事件监听**: 每次参数变化都会触发详细的事件，可用于调试和日志记录
5. **类型安全**: 所有API都提供完整的TypeScript类型支持

## 示例

完整的使用示例请参考 `src/examples/RouteParamsExample.tsx` 文件。
