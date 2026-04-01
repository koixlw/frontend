<template>
  <div class="reservations-management">
    <DataTable
      title="预约管理"
      :columns="columns"
      :data="reservations"
      :loading="loading"
      :pagination="pagination"
      :showAddButton="false"
      @edit="showEditDialog"
      @delete="handleDelete"
      @refresh="loadReservations"
      @page-change="handlePageChange"
    />

    <!-- 编辑表单 -->
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
import { getReservations, updateReservation, deleteReservation } from '@/api/modules';

export default {
  name: 'ReservationsManagement',
  components: {
    DataTable,
    DataForm
  },
  setup() {
    const reservations = ref([]);
    const loading = ref(false);
    const pagination = ref(null);
    const currentPage = ref(0);
    
    const formVisible = ref(false);
    const formTitle = ref('');
    const formLoading = ref(false);
    const currentItem = ref(null);

    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'reservationNumber', label: '预约编号' },
      { key: 'name', label: '预约人' },
      { key: 'phone', label: '联系电话' },
      { key: 'reservationDate', label: '预约日期', type: 'date' },
      { key: 'participants', label: '人数' },
      { key: 'totalAmount', label: '金额', format: (val) => `¥${val}` },
      { key: 'status', label: '状态', type: 'status' },
      { key: 'paymentStatus', label: '支付状态', type: 'status' },
    ];

    const formFields = [
      {
        key: 'status',
        label: '预约状态',
        type: 'select',
        required: true,
        options: [
          { value: 'PENDING', label: '待确认' },
          { value: 'CONFIRMED', label: '已确认' },
          { value: 'CANCELLED', label: '已取消' },
          { value: 'COMPLETED', label: '已完成' }
        ]
      },
      {
        key: 'paymentStatus',
        label: '支付状态',
        type: 'select',
        required: true,
        options: [
          { value: 'UNPAID', label: '未支付' },
          { value: 'PAID', label: '已支付' },
          { value: 'REFUNDED', label: '已退款' }
        ]
      },
      {
        key: 'notes',
        label: '备注',
        type: 'textarea',
        placeholder: '请输入备注信息'
      }
    ];

    const loadReservations = async () => {
      try {
        loading.value = true;
        const response = await getReservations(currentPage.value, 10);
        reservations.value = response.content || [];
        pagination.value = {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };
      } catch (error) {
        console.error('加载预约列表失败:', error);
        alert('加载预约列表失败');
      } finally {
        loading.value = false;
      }
    };

    const showEditDialog = (item) => {
      formTitle.value = '编辑预约';
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
        await updateReservation(currentItem.value.id, data);
        alert('更新成功');
        closeForm();
        loadReservations();
      } catch (error) {
        console.error('更新失败:', error);
        alert('更新失败');
      } finally {
        formLoading.value = false;
      }
    };

    const handleDelete = async (item) => {
      if (!confirm(`确定要删除预约 ${item.reservationNumber} 吗？`)) {
        return;
      }
      try {
        await deleteReservation(item.id);
        alert('删除成功');
        loadReservations();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      loadReservations();
    };

    onMounted(() => {
      loadReservations();
    });

    return {
      reservations,
      loading,
      pagination,
      columns,
      formVisible,
      formTitle,
      formFields,
      formLoading,
      currentItem,
      loadReservations,
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
.reservations-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

