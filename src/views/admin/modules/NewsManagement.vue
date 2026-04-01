<template>
  <div class="news-management">
    <DataTable
      title="新闻管理"
      :columns="columns"
      :data="newsList"
      :loading="loading"
      :pagination="pagination"
      @add="showAddDialog"
      @edit="showEditDialog"
      @delete="handleDelete"
      @refresh="loadNews"
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
import { getAllNews, createNews, updateNews, deleteNews } from '@/api/modules';

export default {
  name: 'NewsManagement',
  components: {
    DataTable,
    DataForm
  },
  setup() {
    const newsList = ref([]);
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
      { key: 'title', label: '标题' },
      { key: 'category', label: '分类' },
      { key: 'author', label: '作者' },
      { key: 'publishDate', label: '发布日期', type: 'date' },
      { key: 'viewCount', label: '浏览量' },
      { key: 'isPublished', label: '状态', format: (val) => val ? '已发布' : '草稿' },
    ];

    const formFields = [
      {
        key: 'title',
        label: '标题',
        type: 'text',
        required: true,
        placeholder: '请输入新闻标题'
      },
      {
        key: 'summary',
        label: '摘要',
        type: 'textarea',
        placeholder: '请输入新闻摘要',
        rows: 3
      },
      {
        key: 'category',
        label: '分类',
        type: 'select',
        required: true,
        options: [
          { value: '传承动态', label: '传承动态' },
          { value: '活动资讯', label: '活动资讯' },
          { value: '研究成果', label: '研究成果' },
          { value: '展览信息', label: '展览信息' }
        ]
      },
      {
        key: 'author',
        label: '作者',
        type: 'text',
        placeholder: '请输入作者'
      },
      {
        key: 'imageUrl',
        label: '封面图片',
        type: 'image',
        help: '点击上传新闻封面图片'
      },
      {
        key: 'publishDate',
        label: '发布日期',
        type: 'date',
        required: true
      },
      {
        key: 'sortOrder',
        label: '排序',
        type: 'number',
        default: 0
      },
      {
        key: 'isPublished',
        label: '是否发布',
        type: 'switch',
        default: false
      }
    ];

    const loadNews = async () => {
      try {
        loading.value = true;
        const response = await getAllNews(currentPage.value, 10);
        newsList.value = response.content || [];
        pagination.value = {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };
      } catch (error) {
        console.error('加载新闻列表失败:', error);
        alert('加载新闻列表失败');
      } finally {
        loading.value = false;
      }
    };

    const showAddDialog = () => {
      isEditing.value = false;
      formTitle.value = '新增新闻';
      currentItem.value = null;
      formVisible.value = true;
    };

    const showEditDialog = (item) => {
      isEditing.value = true;
      formTitle.value = '编辑新闻';
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
          await updateNews(currentItem.value.id, data);
          alert('更新成功');
        } else {
          await createNews(data);
          alert('创建成功');
        }
        closeForm();
        loadNews();
      } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败');
      } finally {
        formLoading.value = false;
      }
    };

    const handleDelete = async (item) => {
      if (!confirm(`确定要删除新闻 ${item.title} 吗？`)) {
        return;
      }
      try {
        await deleteNews(item.id);
        alert('删除成功');
        loadNews();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      loadNews();
    };

    onMounted(() => {
      loadNews();
    });

    return {
      newsList,
      loading,
      pagination,
      columns,
      formVisible,
      formTitle,
      formFields,
      formLoading,
      currentItem,
      loadNews,
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
.news-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

