import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  public createdDate?: Date;

  @UpdateDateColumn({
    name: 'modified_date',
    type: 'timestamp with time zone',
    nullable: true,
    select: false,
  })
  public modifiedDate?: Date;

  @Column({
    type: 'boolean',
    name: 'is_deleted',
    select: false,
    default: false,
  })
  public isDeleted?: boolean;

  @BeforeInsert()
  public async addCreateDate() {
    this.createdDate = new Date();
  }

  @BeforeUpdate()
  public async addModifyDate() {
    this.modifiedDate = new Date();
  }
}
