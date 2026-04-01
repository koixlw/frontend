<template>
  <div class="activities-management">
    <DataTable
      title="活动类型管理"
      :columns="columns"
      :data="activities"
      :loading="loading"
      :pagination="pagination"
      @add="showAddDialog"
      @edit="showEditDialog"
      @delete="handleDelete"
      @refresh="loadActivities"
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
import { getActivityTypes, createActivityType, updateActivityType, deleteActivityType } from '@/api/modules';

export default {
  name: 'ActivitiesManagement',
  components: {
    DataTable,
    DataForm
  },
  setup() {
    const activities = ref([]);
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
      { key: 'name', label: '活动名称' },
      { key: 'code', label: '活动代码' },
      { key: 'basePrice', label: '基础价格', format: (val) => `¥${val}` },
      { key: 'duration', label: '时长(分钟)' },
      { key: 'maxParticipants', label: '最大人数' },
      { key: 'isActive', label: '状态', format: (val) => val ? '启用' : '禁用' },
    ];

    const formFields = [
      {
        key: 'name',
        label: '活动名称',
        type: 'text',
        required: true,
        placeholder: '请输入活动名称'
      },
      {
        key: 'code',
        label: '活动代码',
        type: 'text',
        required: true,
        placeholder: '如：CLAY_MAKING'
      },
      {
        key: 'description',
        label: '活动描述',
        type: 'textarea',
        placeholder: '请输入活动描述'
      },
      {
        key: 'basePrice',
        label: '基础价格',
        type: 'number',
        required: true,
        min: 0,
        step: 0.01
      },
      {
        key: 'duration',
        label: '时长(分钟)',
        type: 'number',
        required: true,
        min: 0
      },
      {
        key: 'maxParticipants',
        label: '最大参与人数',
        type: 'number',
        required: true,
        min: 1
      },
      {
        key: 'isActive',
        label: '是否启用',
        type: 'switch',
        default: true
      }
    ];

    const loadActivities = async () => {
      try {
        loading.value = true;
        const response = await getActivityTypes(currentPage.value, 10);
        activities.value = response.content || [];
        pagination.value = {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };
      } catch (error) {
        console.error('加载活动列表失败:', error);
        alert('加载活动列表失败');
      } finally {
        loading.value = false;
      }
    };

    const showAddDialog = () => {
      isEditing.value = false;
      formTitle.value = '新增活动类型';
      currentItem.value = null;
      formVisible.value = true;
    };

    const showEditDialog = (item) => {
      isEditing.value = true;
      formTitle.value = '编辑活动类型';
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
          await updateActivityType(currentItem.value.id, data);
          alert('更新成功');
        } else {
          await createActivityType(data);
          alert('创建成功');
        }
        closeForm();
        loadActivities();
      } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败');
      } finally {
        formLoading.value = false;
      }
    };

    const handleDelete = async (item) => {
      if (!confirm(`确定要删除活动类型 ${item.name} 吗？`)) {
        return;
      }
      try {
        await deleteActivityType(item.id);
        alert('删除成功');
        loadActivities();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      loadActivities();
    };

    onMounted(() => {
      loadActivities();
    });

    return {
      activities,
      loading,
      pagination,
      columns,
      formVisible,
      formTitle,
      formFields,
      formLoading,
      currentItem,
      loadActivities,
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
.activities-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

