<template>
  <transition name="tech-dialog-fade">
    <div
      v-if="modelValue"
      class="tech-dialog-overlay"
      :class="{'light-theme': !isDarkTheme}"
      @click="handleOverlayClick">
      <div class="tech-dialog-container" @click.stop>
        <div class="tech-dialog-box" :class="{'light-theme': !isDarkTheme}">
          <!-- 对话框头部 -->
          <div class="tech-dialog-header">
            <h3 class="tech-dialog-title">{{ title }}</h3>
            <button
              class="tech-dialog-close"
              @click="handleClose">
              ✕
            </button>
          </div>

          <!-- 对话框内容 -->
          <div class="tech-dialog-body">
            <slot></slot>
          </div>

          <!-- 对话框底部 -->
          <div class="tech-dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "TechDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "500px"
    },
    beforeClose: {
      type: Function
    },
    isDarkTheme: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const handleClose = () => {
      if (props.beforeClose) {
        props.beforeClose(() => {
          emit('update:modelValue', false);
          emit('close');
        });
      } else {
        emit('update:modelValue', false);
        emit('close');
      }
    };

    const handleOverlayClick = () => {
      // 可选：点击遮罩关闭
      handleClose();
    };

    return {
      handleClose,
      handleOverlayClick
    };
  }
};
</script>

<style scoped>
/* 对话框动画 */
.tech-dialog-fade-enter-active,
.tech-dialog-fade-leave-active {
  transition: all 0.3s ease;
}

.tech-dialog-fade-enter-from,
.tech-dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 遮罩层 */
.tech-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.tech-dialog-overlay.light-theme {
  background: rgba(0, 0, 0, 0.5);
}

/* 对话框容器 */
.tech-dialog-container {
  max-width: 95vw;
  max-height: 95vh;
  margin: 0 auto;
  position: relative;
}

/* 对话框主体 */
.tech-dialog-box {
  background-color: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  width: v-bind(width);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.tech-dialog-box.light-theme {
  background-color: #ffffff;
  color: #333;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 对话框头部 */
.tech-dialog-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tech-dialog-box.light-theme .tech-dialog-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.tech-dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.tech-dialog-box.light-theme .tech-dialog-title {
  color: #333;
}

.tech-dialog-close {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tech-dialog-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.tech-dialog-box.light-theme .tech-dialog-close {
  color: rgba(0, 0, 0, 0.5);
}

.tech-dialog-box.light-theme .tech-dialog-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #000;
}

/* 对话框内容 */
.tech-dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* 对话框底部 */
.tech-dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.tech-dialog-box.light-theme .tech-dialog-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
