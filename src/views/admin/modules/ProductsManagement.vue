<template>
  <div class="products-management">
    <DataTable
      title="商品管理"
      :columns="columns"
      :data="products"
      :loading="loading"
      :pagination="pagination"
      @add="showAddDialog"
      @edit="showEditDialog"
      @delete="handleDelete"
      @refresh="loadProducts"
      @page-change="handlePageChange"
    />

    <!-- 新增/编辑表单 -->
    <DataForm
      v-if="formVisible"
      :title="formTitle"
      :fields="formFields"
      :initialData="currentItem"
      :loading="formLoading"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import DataTable from '../../components/admin/DataTable.vue';
import DataForm from '../../components/admin/DataForm.vue';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/modules';
import { getAllInheritors } from '../../api/inheritor';

export default {
  name: 'ProductsManagement',
  components: {
    DataTable,
    DataForm
  },
  setup() {
    const products = ref([]);
    const loading = ref(false);
    const pagination = ref(null);
    const currentPage = ref(0);
    
    const formVisible = ref(false);
    const formTitle = ref('');
    const formLoading = ref(false);
    const currentItem = ref(null);
    const isEditing = ref(false);
    
    // 传承人列表
    const inheritors = ref([]);

    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'title', label: '商品名称' },
      { key: 'categoryId', label: '分类ID' },
      { key: 'price', label: '售价', format: (val) => `¥${val}` },
      { key: 'originalPrice', label: '原价', format: (val) => val ? `¥${val}` : '-' },
      { key: 'stock', label: '库存' },
      { key: 'salesCount', label: '销量' },
      { key: 'isOnSale', label: '状态', format: (val) => val ? '上架' : '下架' },
      { key: 'createdAt', label: '创建时间', type: 'date' },
    ];

    // 计算属性：表单字段配置
    const formFields = computed(() => {
      // 动态生成传承人选项（添加安全检查）
      const inheritorOptions = [
        { value: null, label: '无关联传承人' },
        ...(Array.isArray(inheritors.value) ? inheritors.value : []).map(inheritor => ({
          value: inheritor.id,
          label: `${inheritor.name} - ${inheritor.title || inheritor.level || '未知级别'}`
        }))
      ];

      return [
        {
          key: 'title',
          label: '商品名称',
          type: 'text',
          required: true,
          placeholder: '请输入商品名称'
        },
        {
          key: 'description',
          label: '商品描述',
          type: 'textarea',
          placeholder: '请输入商品描述'
        },
        {
          key: 'categoryId',
          label: '商品分类',
          type: 'select',
          required: true,
          options: [
            { value: 1, label: '泥塑作品' },
            { value: 2, label: '手工艺品' },
            { value: 3, label: '文创产品' },
            { value: 4, label: '纪念品' },
            { value: 5, label: '其他' }
          ]
        },
        {
          key: 'price',
          label: '售价',
          type: 'number',
          required: true,
          min: 0,
          step: 0.01
        },
        {
          key: 'originalPrice',
          label: '原价',
          type: 'number',
          min: 0,
          step: 0.01
        },
        {
          key: 'stock',
          label: '库存',
          type: 'number',
          required: true,
          min: 0,
          default: 0
        },
        {
          key: 'inheritorId',
          label: '关联传承人',
          type: 'select',
          options: inheritorOptions,
          help: '选择相关传承人（可选）',
          placeholder: '请选择传承人'
        },
        {
          key: 'imageUrl',
          label: '商品图片',
          type: 'image',
          help: '点击上传商品图片'
        },
        {
          key: 'sortOrder',
          label: '排序',
          type: 'number',
          default: 0
        },
        {
          key: 'isNew',
          label: '新品标识',
          type: 'switch',
          default: false
        },
        {
          key: 'isHot',
          label: '热卖标识',
          type: 'switch',
          default: false
        },
        {
          key: 'isFeatured',
          label: '精选标识',
          type: 'switch',
          default: false
        },
        {
          key: 'isOnSale',
          label: '是否上架',
          type: 'switch',
          default: true
        }
      ];
    });

    // 加载传承人列表
    const loadInheritors = async () => {
      try {
        const response = await getAllInheritors();
        // 处理包装对象：如果返回的是 {success: true, data: [...]}，提取 data
        if (response && response.data && Array.isArray(response.data)) {
          inheritors.value = response.data;
        } else if (Array.isArray(response)) {
          inheritors.value = response;
        } else {
          inheritors.value = [];
        }
        console.log('传承人列表加载成功:', inheritors.value.length, '位');
        if (inheritors.value.length > 0) {
          console.log('第一个传承人示例:', inheritors.value[0].name, '-', inheritors.value[0].title || inheritors.value[0].level);
        }
      } catch (error) {
        console.error('加载传承人列表失败:', error);
        // 静默失败，不影响主功能
        inheritors.value = [];
      }
    };

    const loadProducts = async () => {
      try {
        loading.value = true;
        const response = await getProducts(currentPage.value, 10);
        products.value = response.content || [];
        pagination.value = {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };
      } catch (error) {
        console.error('加载商品列表失败:', error);
        alert('加载商品列表失败');
      } finally {
        loading.value = false;
      }
    };

    const showAddDialog = () => {
      isEditing.value = false;
      formTitle.value = '新增商品';
      currentItem.value = null;
      formVisible.value = true;
    };

    const showEditDialog = (item) => {
      isEditing.value = true;
      formTitle.value = '编辑商品';
      currentItem.value = { ...item };
      formVisible.value = true;
    };

    const closeForm = () => {
      formVisible.value = false;
      currentItem.value = null;
    };

    const handleSubmit = async (data) => {
      try {
        formLoading.value = true;
        if (isEditing.value) {
          await updateProduct(currentItem.value.id, data);
          alert('更新成功');
        } else {
          await createProduct(data);
          alert('创建成功');
        }
        closeForm();
        loadProducts();
      } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败');
      } finally {
        formLoading.value = false;
      }
    };

    const handleDelete = async (item) => {
      if (!confirm(`确定要删除商品 ${item.name} 吗？`)) {
        return;
      }
      try {
        await deleteProduct(item.id);
        alert('删除成功');
        loadProducts();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      loadProducts();
    };

    onMounted(() => {
      loadInheritors(); // 先加载传承人列表
      loadProducts();
    });

    return {
      products,
      loading,
      pagination,
      columns,
      formVisible,
      formTitle,
      formFields,
      formLoading,
      currentItem,
      loadProducts,
      showAddDialog,
      showEditDialog,
      closeForm,
      handleSubmit,
      handleDelete,
      handlePageChange
    };
  }
};
</script>

<style scoped>
.products-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

