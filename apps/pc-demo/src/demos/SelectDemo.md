# Select 组件演示

## 功能说明

这个 demo 展示了 Select 组件的完整功能，包括：

### 1. 初始化远程加载

- 省份字段在表单初始化时从远程加载数据
- 使用 Form 的 `initReqs` 配置实现

### 2. 字段联动

- 当省份变化时，自动触发城市字段的选项加载
- 城市字段的 `req` 配置中设置 `effectedBy: ['province']`

### 3. 远程搜索

- 城市字段支持远程搜索，输入关键词时触发搜索请求
- Select 组件设置 `remoteSearch={true}`
- 在搜索时触发 `store.dispatchFieldRequest`

### 4. 编辑模式回填

- 在编辑模式下，根据已选择的城市 ID 自动回填省份和城市信息
- 通过 `initReqs` 中的 `editCityInfo` 请求实现
- 根据城市 ID 获取省份信息并设置值，然后触发城市字段的请求

## 技术实现

### 模拟 API

```typescript
const mockApi = {
  // 获取省份列表
  getProvinces: async () => { ... },

  // 获取城市列表（根据省份ID）
  getCities: async (provinceId: string) => { ... },

  // 搜索城市（支持关键词搜索）
  searchCities: async (provinceId: string, keyword: string) => { ... },

  // 根据城市ID获取城市详情（用于编辑模式回填）
  getCityById: async (cityId: string) => { ... },
};
```

### 表单配置

```typescript
<Form
  mode={formMode}
  initialValues={editData}
  initReqs={{
    // 初始化请求：获取省份列表
    provinces: {
      req: async () => {
        const result = await mockApi.getProvinces();
        return result;
      },
    },
    // 编辑模式下的初始化请求：根据城市ID获取省份和城市信息
    editCityInfo: {
      req: async ({ store }) => {
        if (formMode === FormMode.EDIT && editData?.city) {
          const result = await mockApi.getCityById(editData.city);
          if (result.success && result.data) {
            // 设置省份值
            store.setValue('province', result.data.provinceId);
            // 触发城市字段的请求
            await store.dispatchFieldRequest('city');
          }
          return result;
        }
        return { success: true, data: null };
      },
      mode: [FormMode.EDIT],
    },
  }}
>
```

### 字段配置

```typescript
// 省份字段
<FormItem
  id="province"
  label="省份"
  required
  req={{
    handler: async () => {
      const result = await mockApi.getProvinces();
      return result;
    },
  }}
>
  <Select
    id="province"
    placeholder="请选择省份"
    style={{ width: '100%' }}
  />
</FormItem>

// 城市字段
<FormItem
  id="city"
  label="城市"
  required
  req={{
    effectedBy: ['province'], // 依赖省份字段
    handler: async ({ store, value, keyword }) => {
      const provinceId = value || store.getValue('province');
      if (!provinceId) {
        return { success: true, data: [] };
      }

      // 如果有搜索关键词，则进行搜索
      if (keyword) {
        const result = await mockApi.searchCities(provinceId, keyword);
        return result;
      }

      // 否则获取所有城市
      const result = await mockApi.getCities(provinceId);
      return result;
    },
  }}
>
  <Select
    id="city"
    placeholder="请选择城市"
    remoteSearch={true} // 启用远程搜索
    style={{ width: '100%' }}
  />
</FormItem>
```

## 使用说明

1. **创建模式**：选择省份后，城市字段会自动加载对应的城市列表
2. **编辑模式**：切换到编辑模式，会看到省份和城市字段已经自动回填
3. **远程搜索**：在城市字段中输入关键词，会触发远程搜索
4. **表单提交**：填写完表单后点击提交，会显示提交的数据

## 核心特性

- ✅ 初始化远程加载数据
- ✅ 字段联动（省份变化触发城市加载）
- ✅ 远程搜索功能
- ✅ 编辑模式数据回填
- ✅ 完整的错误处理
- ✅ 加载状态管理
