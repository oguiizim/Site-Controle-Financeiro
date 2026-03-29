package prota.money.transaction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import prota.money.category.CategoryModel;
import prota.money.user.UserModel;

@Entity
@Table(name = TransactionModel.tableName)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class TransactionModel {
    public static final String tableName = "transaction";

    @Id
    @Column(name = "id", unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryModel category;

    @Column(name = "name", length = 100, nullable = false)
    @NotBlank(message = "Esse campo é obrigatorio")
    private String name;

    @Column(name = "value", nullable = false)
    @NotNull(message = "Esse campo é obrigatorio")
    private Float value;

    @Column(name = "description", length = 255)
    private String description;

}
