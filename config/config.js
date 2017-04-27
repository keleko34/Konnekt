Konnekt.config({
  filters:{
    toUpperCase:function(v)
    {
      return (v).toUpperCase();
    },
    toLowerCase:function(v)
    {
      return (v).toLowerCase();
    },
    toFirstUpperCase:function(v)
    {
      return (v)[0].toUpperCase() + (v).slice(1);
    },
    toEveryFirstUpperCase:function(v)
    {
      return (v).split(' ').map(function(str){
        return (str)[0].toUpperCase() + (str).slice(1);
      });
    },
    isHidden:function(v)
    {
      return (v ? 'none' : 'block');
    },
    isNotHidden:function(v)
    {
      return (v ? 'block' : 'none');
    }
  }
});