# Generated by Django 2.2.12 on 2022-01-07 16:38

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LoonUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(max_length=50, unique=True, verbose_name='用户名')),
                ('alias', models.CharField(default='', max_length=50, verbose_name='姓名')),
                ('email', models.EmailField(max_length=255, verbose_name='邮箱')),
                ('phone', models.CharField(default='', max_length=13, verbose_name='电话')),
                ('is_active', models.BooleanField(default=True, verbose_name='已激活')),
                ('type_id', models.IntegerField(default=0, verbose_name='用户类型')),
                ('creator', models.CharField(max_length=50, verbose_name='创建人')),
                ('gmt_created', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('gmt_modified', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='已删除')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AppToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creator', models.CharField(max_length=50, verbose_name='创建人')),
                ('gmt_created', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('gmt_modified', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='已删除')),
                ('app_name', models.CharField(max_length=50, verbose_name='应用名称')),
                ('token', models.CharField(help_text='后端自动生成', max_length=50, verbose_name='签名令牌')),
                ('ticket_sn_prefix', models.CharField(default='loonflow', help_text='工单流水号前缀，如设置为loonflow,则创建的工单的流水号为loonflow_201805130013', max_length=20, verbose_name='工单流水号前缀')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LoonDept',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='部门名称', max_length=50, verbose_name='名称')),
                ('parent_dept_id', models.IntegerField(blank=True, default=0, verbose_name='上级部门id')),
                ('leader', models.CharField(blank=True, default='', help_text='部门的leader, loonuser表中的用户名', max_length=50, verbose_name='部门leader')),
                ('approver', models.CharField(blank=True, default='', help_text='loonuser表中的用户名, 逗号隔开多个user。当工作流设置为leader审批时， 优先以审批人为准，如果审批人为空，则取leader', max_length=100, verbose_name='审批人')),
                ('label', models.CharField(blank=True, default='', help_text='因为部门信息一般是从别处同步过来， 为保证对应关系，同步时可以在此字段设置其他系统中相应的唯一标识', max_length=50, verbose_name='标签')),
                ('creator', models.CharField(help_text='loonuser表中的用户名', max_length=50, verbose_name='创建人')),
                ('gmt_created', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('gmt_modified', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='已删除')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LoonRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='名称')),
                ('description', models.CharField(default='', max_length=50, verbose_name='描述')),
                ('label', models.CharField(blank=True, default='{}', help_text='因为角色信息也可能是从别处同步过来， 为保证对应关系，同步时可以在此字段设置其他系统中相应的唯一标识,字典的json格式', max_length=50, verbose_name='标签')),
                ('creator', models.CharField(max_length=50, verbose_name='创建人')),
                ('gmt_created', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('gmt_modified', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='已删除')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LoonUserRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creator', models.CharField(max_length=50, verbose_name='创建人')),
                ('gmt_created', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('gmt_modified', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='已删除')),
                ('user_id', models.IntegerField(verbose_name='用户id')),
                ('role_id', models.IntegerField(verbose_name='角色id')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LoonUserDept',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creator', models.CharField(max_length=50, verbose_name='创建人')),
                ('gmt_created', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('gmt_modified', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='已删除')),
                ('dept', models.ForeignKey(db_constraint=False, on_delete=False, to='account.LoonDept')),
                ('user', models.ForeignKey(db_constraint=False, on_delete=False, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]