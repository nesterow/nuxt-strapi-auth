/**
 * Cookies mock
 */
export default () => ({ 
  /**
   * set
   * @param key - string
   * @param value - any
   */
  set(k: string, v: any) { 
    this[k] = typeof v === 'object' ? JSON.stringify(v) : v;
  }, 
  /**
   * get
   * @param k - string
   */
  get(k: string) { 
    return this[k];
  },
}) as any;