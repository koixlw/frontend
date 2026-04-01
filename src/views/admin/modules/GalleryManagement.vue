<template>
  <div class="gallery-management">
    <DataTable
      title="作品管理"
      :columns="columns"
      :data="works"
      :loading="loading"
      :pagination="pagination"
      @add="showAddDialog"
      @edit="showEditDialog"
      @delete="handleDelete"
      @refresh="loadWorks"
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
import { ref, onMounted } from 'vue';
import DataTable from '../../components/admin/DataTable.vue';
import DataForm from '../../components/admin/DataForm.vue';
import { getGalleryWorks, createGalleryWork, updateGalleryWork, deleteGalleryWork } from '@/api/modules';

export default {
  name: 'GalleryManagement',
  components: {
    DataTable,
    DataForm
  },
  setup() {
    const works = ref([]);
    const loading = ref(false);
    const pagination = ref(null);
    const currentPage = ref(0);
    
    const formVisible = ref(false);
    const formTitle = ref('');
    const formLoading = ref(false);
    const currentItem = ref(null);
    const isEditing = ref(false);

    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'title', label: '作品名称' },
      { key: 'artist', label: '作者' },
      { key: 'year', label: '创作年份' },
      { key: 'material', label: '材质' },
      { key: 'width', label: '宽度(cm)' },
      { key: 'height', label: '高度(cm)' },
      { key: 'likes', label: '点赞数' },
      { key: 'isActive', label: '状态', format: (val) => val ? '展示' : '隐藏' },
    ];

    const formFields = [
      {
        key: 'title',
        label: '作品名称',
        type: 'text',
        required: true,
        placeholder: '请输入作品名称'
      },
      {
        key: 'description',
        label: '作品描述',
        type: 'textarea',
        placeholder: '请输入作品描述'
      },
      {
        key: 'artist',
        label: '作者',
        type: 'text',
        required: true,
        placeholder: '请输入作者姓名'
      },
      {
        key: 'year',
        label: '创作年份',
        type: 'text',
        required: true,
        placeholder: '如：2023 或 2020-2023',
        maxlength: 10
      },
      {
        key: 'categoryId',
        label: '作品类别',
        type: 'select',
        required: true,
        options: [
          { value: 1, label: '传统工艺' },
          { value: 2, label: '现代创作' },
          { value: 3, label: '非遗作品' },
          { value: 4, label: '文创产品' },
          { value: 5, label: '其他' }
        ]
      },
      {
        key: 'styleId',
        label: '风格流派',
        type: 'select',
        required: true,
        options: [
          { value: 1, label: '传统风格' },
          { value: 2, label: '现代风格' },
          { value: 3, label: '融合风格' },
          { value: 4, label: '创新风格' },
          { value: 5, label: '其他' }
        ]
      },
      {
        key: 'material',
        label: '材质',
        type: 'text',
        placeholder: '如：陶土、木材等'
      },
      {
        key: 'width',
        label: '宽度(cm)',
        type: 'number',
        placeholder: '请输入宽度',
        min: 0,
        step: 0.1
      },
      {
        key: 'height',
        label: '高度(cm)',
        type: 'number',
        placeholder: '请输入高度',
        min: 0,
        step: 0.1
      },
      {
        key: 'depth',
        label: '深度(cm)',
        type: 'number',
        placeholder: '请输入深度（可选）',
        min: 0,
        step: 0.1
      },
      {
        key: 'imageUrl',
        label: '作品图片',
        type: 'image',
        help: '点击上传作品图片'
      },
      {
        key: 'sortOrder',
        label: '排序',
        type: 'number',
        default: 0
      },
      {
        key: 'isActive',
        label: '是否展示',
        type: 'switch',
        default: true
      }
    ];

    const loadWorks = async () => {
      try {
        loading.value = true;
        const response = await getGalleryWorks(currentPage.value, 10);
        works.value = response.content || [];
        pagination.value = {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };
      } catch (error) {
        console.error('加载作品列表失败:', error);
        alert('加载作品列表失败');
      } finally {
        loading.value = false;
      }
    };

    const showAddDialog = () => {
      isEditing.value = false;
      formTitle.value = '新增作品';
      currentItem.value = null;
      formVisible.value = true;
    };

    const showEditDialog = (item) => {
      isEditing.value = true;
      formTitle.value = '编辑作品';
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
          await updateGalleryWork(currentItem.value.id, data);
          alert('更新成功');
        } else {
          await createGalleryWork(data);
          alert('创建成功');
        }
        closeForm();
        loadWorks();
      } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败');
      } finally {
        formLoading.value = false;
      }
    };

    const handleDelete = async (item) => {
      if (!confirm(`确定要删除作品 ${item.title} 吗？`)) {
        return;
      }
      try {
        await deleteGalleryWork(item.id);
        alert('删除成功');
        loadWorks();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      loadWorks();
    };

    onMounted(() => {
      loadWorks();
    });

    return {
      works,
      loading,
      pagination,
      columns,
      formVisible,
      formTitle,
      formFields,
      formLoading,
      currentItem,
      loadWorks,
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
.gallery-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

